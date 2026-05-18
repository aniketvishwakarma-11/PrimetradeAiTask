const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const authMiddleware = require('../middleware/auth');
const authorizeRole = require('../middleware/authorize');
const validateRequest = require('../middleware/validation');
const Joi = require('joi');

// Validation schemas
const createNoteSchema = Joi.object({
  title: Joi.string().max(200).required(),
  content: Joi.string().max(5000).required(),
});

const updateNoteSchema = Joi.object({
  title: Joi.string().max(200),
  content: Joi.string().max(5000),
}).min(1);

/**
 * @swagger
 * /api/v1/notes:
 *   post:
 *     summary: Create a new note
 *     tags:
 *       - Notes
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: Note created successfully
 *       401:
 *         description: Unauthorized - token missing or invalid
 *
 *   get:
 *     summary: Get all notes
 *     tags:
 *       - Notes
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Notes retrieved successfully
 *       401:
 *         description: Unauthorized - token missing or invalid
 */
router.post('/', authMiddleware, validateRequest(createNoteSchema), async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const note = new Note({
      title,
      content,
      userId: req.userId,
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    let query;

    if (req.userRole === 'admin') {
      // Admin can see all notes
      query = Note.find();
    } else {
      // Regular user sees only their notes
      query = Note.find({ userId: req.userId });
    }

    const notes = await query.sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Notes retrieved successfully',
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   get:
 *     summary: Get a single note by ID
 *     tags:
 *       - Notes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Note not found
 *
 *   put:
 *     summary: Update a note
 *     tags:
 *       - Notes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Note not found
 *
 *   delete:
 *     summary: Delete a note
 *     tags:
 *       - Notes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Note deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Note not found
 */
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // Check ownership: user can only view their own notes (admin can view any)
    if (note.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this note',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note retrieved successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authMiddleware, validateRequest(updateNoteSchema), async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // Check ownership: user can only update their own notes (admin can update any)
    if (note.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this note',
      });
    }

    // Update fields
    if (req.body.title) note.title = req.body.title;
    if (req.body.content) note.content = req.body.content;

    await note.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // Check ownership: user can only delete their own notes (admin can delete any)
    if (note.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this note',
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
