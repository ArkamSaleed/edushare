const express = require('express');
const router = express.Router();
const container = require('../db');
const bodyParser = require('body-parser');

// Middleware to parse JSON request bodies
router.use(bodyParser.json());

// Get all files
router.get('/', async (req, res) => {
    try {
        const query = {
            query: "SELECT * FROM c WHERE c.type = 'file' ORDER BY c.uploadedAt DESC"
        };

        const { resources: files } = await container.items.query(query).fetchAll();

        res.status(200).json({
            success: true,
            files: files
        });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching files',
            error: error.message
        });
    }
});

// Get files by user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const query = {
            query: "SELECT * FROM c WHERE c.type = 'file' AND c.uploadedBy.id = @userId ORDER BY c.uploadedAt DESC",
            parameters: [{ name: "@userId", value: userId }]
        };

        const { resources: files } = await container.items.query(query).fetchAll();

        res.status(200).json({
            success: true,
            files: files
        });
    } catch (error) {
        console.error('Error fetching user files:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user files',
            error: error.message
        });
    }
});

// Enhanced validation and error handling for file upload
router.post('/upload', async (req, res) => {
    try {
        const { fileName, fileSize, fileType, fileData, uploadedBy } = req.body;

        // Validation
        if (!fileName || typeof fileName !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing file name.'
            });
        }

        if (!fileSize || typeof fileSize !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing file size.'
            });
        }

        if (!fileType || typeof fileType !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing file type.'
            });
        }

        if (!fileData || typeof fileData !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing file data.'
            });
        }

        if (!uploadedBy || typeof uploadedBy !== 'object' || !uploadedBy.id) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing uploader information.'
            });
        }

        // Create file object
        const newFile = {
            id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'file',
            fileName,
            fileSize,
            fileType,
            fileData, // Base64 encoded file content
            uploadedBy: {
                id: uploadedBy.id,
                firstName: uploadedBy.firstName,
                lastName: uploadedBy.lastName,
                email: uploadedBy.email
            },
            uploadedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            commentCount: 0
        };

        // Save to database
        const { resource: createdFile } = await container.items.create(newFile);

        res.status(201).json({
            success: true,
            message: 'File uploaded successfully',
            file: createdFile
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        });
    }
});

// Download file
router.get('/download/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;

        const query = {
            query: "SELECT * FROM c WHERE c.id = @fileId AND c.type = 'file'",
            parameters: [{ name: "@fileId", value: fileId }]
        };

        const { resources: files } = await container.items.query(query).fetchAll();

        if (files.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        const file = files[0];

        res.status(200).json({
            success: true,
            file: {
                id: file.id,
                fileName: file.fileName,
                fileSize: file.fileSize,
                fileType: file.fileType,
                fileData: file.fileData,
                uploadedBy: file.uploadedBy,
                uploadedAt: file.uploadedAt
            }
        });

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({
            success: false,
            message: 'Error downloading file',
            error: error.message
        });
    }
});

// Delete file
router.delete('/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        const { userId } = req.body; // Assuming userId is passed in the request body

        // Fetch the file to check ownership
        const query = {
            query: "SELECT * FROM c WHERE c.id = @fileId AND c.type = 'file'",
            parameters: [{ name: "@fileId", value: fileId }]
        };

        const { resources: files } = await container.items.query(query).fetchAll();

        if (files.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        const file = files[0];

        // Check if the user owns the file
        if (file.uploadedBy.id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this file'
            });
        }

        // Delete the file
        await container.item(fileId, 'file').delete();

        res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting file',
            error: error.message
        });
    }
});

// Update file
router.put('/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        const { userId } = req.body;
        const { fileName, mention } = req.body;

        const query = {
            query: "SELECT * FROM c WHERE c.id = @fileId AND c.type = 'file'",
            parameters: [{ name: "@fileId", value: fileId }]
        };

        const { resources: files } = await container.items.query(query).fetchAll();

        if (files.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        const file = files[0];

        // Check if user owns the file
        if (file.uploadedBy.id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to edit this file'
            });
        }

        // Validation
        if (!fileName || fileName.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'File name cannot be empty'
            });
        }

        // Update file details
        file.fileName = fileName.trim();
        file.mention = mention || null;
        file.updatedAt = new Date().toISOString();

        // Save updated file to database
        await container.item(fileId, 'file').replace(file);

        res.status(200).json({
            success: true,
            message: 'File updated successfully',
            file: file
        });

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating file',
            error: error.message
        });
    }
});

module.exports = router;
