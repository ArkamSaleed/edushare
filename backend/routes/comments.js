const express = require('express');
const router = express.Router();
const container = require('../db');

// Get comments for a file
router.get('/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;

        const query = {
            query: "SELECT * FROM c WHERE c.type = 'comment' AND c.fileId = @fileId ORDER BY c.createdAt DESC",
            parameters: [{ name: "@fileId", value: fileId }]
        };

        const { resources: comments } = await container.items.query(query).fetchAll();

        res.status(200).json({
            success: true,
            comments: comments
        });

    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching comments',
            error: error.message
        });
    }
});

// Add comment to a file
router.post('/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        const { text, author } = req.body;

        // Validation
        if (!text || !author) {
            return res.status(400).json({
                success: false,
                message: 'Comment text and author are required'
            });
        }

        if (text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Comment cannot be empty'
            });
        }

        // Check if file exists
        const fileQuery = {
            query: "SELECT * FROM c WHERE c.id = @fileId AND c.type = 'file'",
            parameters: [{ name: "@fileId", value: fileId }]
        };

        const { resources: files } = await container.items.query(fileQuery).fetchAll();

        if (files.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Create comment object
        const newComment = {
            id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'comment',
            fileId: fileId,
            text: text.trim(),
            author: {
                id: author.id,
                firstName: author.firstName,
                lastName: author.lastName,
                email: author.email
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save comment to database
        const { resource: createdComment } = await container.items.create(newComment);

        // Update file's comment count
        const file = files[0];
        file.commentCount = (file.commentCount || 0) + 1;
        file.updatedAt = new Date().toISOString();
        await container.item(file.id, 'file').replace(file);

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            comment: createdComment
        });

    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding comment',
            error: error.message
        });
    }
});

// Delete comment
router.delete('/:fileId/:commentId', async (req, res) => {
    try {
        const { fileId, commentId } = req.params;
        const { userId } = req.body;

        // Get the comment to check ownership
        const query = {
            query: "SELECT * FROM c WHERE c.id = @commentId AND c.type = 'comment'",
            parameters: [{ name: "@commentId", value: commentId }]
        };

        const { resources: comments } = await container.items.query(query).fetchAll();

        if (comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        const comment = comments[0];

        // Check if user owns the comment
        if (comment.author.id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this comment'
            });
        }

        // Delete the comment
        await container.item(commentId, 'comment').delete();

        // Update file's comment count
        const fileQuery = {
            query: "SELECT * FROM c WHERE c.id = @fileId AND c.type = 'file'",
            parameters: [{ name: "@fileId", value: fileId }]
        };

        const { resources: files } = await container.items.query(fileQuery).fetchAll();
        
        if (files.length > 0) {
            const file = files[0];
            file.commentCount = Math.max((file.commentCount || 1) - 1, 0);
            file.updatedAt = new Date().toISOString();
            await container.item(file.id, 'file').replace(file);
        }

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting comment',
            error: error.message
        });
    }
});

module.exports = router;
