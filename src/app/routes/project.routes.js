const ProjectController = require('../controllers/project.controller.js');
const ProjectUpdateController = require('../controllers/project_update.controller.js');
const ProjectFileController = require('../controllers/project_file.controller.js');
const requireAuth = require('../middlewares/requireAuth');

const createProjectSchema = {
    body: {
        type: 'object',
        required: ['project_name', 'description', 'project_status', 'client_id'],
        properties: {
            project_name: { type: 'string' },
            description: { type: 'string', nullable: true },
            project_status: { type: 'string', enum: ['active', 'waiting', 'completed'], default: 'active' },
            client_id: { type: 'integer' },
        },
        additionalProperties: false,
    },
};

const projectIdParam = {
    type: 'object',
    required: ['id'],
    properties: {
        id: { type: 'integer' },
    },
    additionalProperties: false,
};

const listProjectsResponse = {
    200: {
        type: 'object',
        properties: {
            message: { type: 'string' },
            data: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        description: { type: 'string', nullable: true },
                        status: { type: 'string', enum: ['active', 'waiting', 'completed'] },
                        created_at: { type: 'string' },
                        updated_at: { type: 'string' },
                        public_slug: { type: 'string' },
                        client: {
                            id: { type: 'integer' },
                            name: { type: 'string' },
                        }
                    },
                    additionalProperties: false,
                },
            },
        },
        additionalProperties: false,
    },
};

// update project
const updateProjectSchema = {
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['active', 'waiting', 'completed'] },
        },
        additionalProperties: false,
    },
};

// add an update to project.
const createUpdateSchema = {
    body: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
            title: { type: 'string' },
            content: { type: 'string' },
        },
        additionalProperties: false,
    },
};

// add a file to project.
const createFileSchema = {
    body: {
        type: 'object',
        required: ['title', 'url', 'type'],
        properties: {
            title: { type: 'string' },
            url: { type: 'string' },
            type: { type: 'string', enum: ['link', 'file'] },
        },
        additionalProperties: false,
    },
};

async function projectsRoutes(fastify) {
    fastify.post(
        '/projects',
        {
            preHandler: requireAuth,
            schema: {
                body: createProjectSchema.body,
            },
        },
        ProjectController.createProject
    );

    fastify.get(
        '/projects',
        {
            preHandler: requireAuth,
            schema: {
                response: listProjectsResponse,
            },
        },
        ProjectController.listProjects
    );

    fastify.get(
        '/projects/:id',
        {
            preHandler: requireAuth,
            schema: {
                params: projectIdParam,
            },
        },
        ProjectController.getProjectById
    );

// update the specific project like name, description, status.
    fastify.patch(
        '/projects/:id',
        {
            preHandler: requireAuth,
            schema: {
                params: projectIdParam,
                body: updateProjectSchema.body,
            },
        },
        ProjectController.patchProject
    );

    fastify.delete(
        '/projects/:id',
        {
            preHandler: requireAuth,
            schema: {
                params: projectIdParam,
            },
        },
        ProjectController.deleteProject
    );

    //  get all updates of the specific project.
    fastify.get(
        '/projects/:id/updates',
        {
            preHandler: requireAuth,
            schema: {
                params: projectIdParam,
            },
        },
        ProjectUpdateController.listUpdates
    );

    // add an update to the specific project.
    fastify.post(
        '/projects/:id/updates',
        {
            preHandler: requireAuth,
            schema: {
                params: projectIdParam,
                body: createUpdateSchema.body,
            },
        },
        ProjectUpdateController.createUpdate
    );

    // delete the specific update of the specific project.
    fastify.delete(
        '/projects/:id/updates/:updateId',
        {
            preHandler: requireAuth,
            schema: {
                params: {
                    type: 'object',
                    required: ['id', 'updateId'],
                    properties: {
                        id: { type: 'integer' },
                        updateId: { type: 'integer' },
                    },
                    additionalProperties: false,
                },
            },
        },
        ProjectUpdateController.deleteUpdate
    );

    fastify.delete(
        '/updates/:id',
        {
            preHandler: requireAuth,
            schema: {
                params: projectIdParam,
            },
        },
        ProjectUpdateController.deleteUpdate
    );

    // get all files of the specific project.
    fastify.get(
        '/projects/:id/files',
        {
            preHandler: requireAuth,
            schema: {
                params: projectIdParam,
            },
        },
        ProjectFileController.listFiles
    );

    // add a file to the specific project.
    fastify.post(
        '/projects/:id/files',
        {
            preHandler: requireAuth,
            schema: {
                params: projectIdParam,
                body: createFileSchema.body,
            },
        },
        ProjectFileController.createFile
    );

    // upload a file to the specific project (multipart/form-data).
    fastify.post(
        '/projects/:id/files/upload',
        {
            preHandler: requireAuth,
            schema: {
                params: projectIdParam,
            },
        },
        ProjectFileController.uploadFile
    );

    // delete the specific file of the specific project.
    fastify.delete(
        '/projects/:id/files/:fileId',
        {
            preHandler: requireAuth,
            schema: {
                params: {
                    type: 'object',
                    required: ['id', 'fileId'],
                    properties: {
                        id: { type: 'integer' },
                        fileId: { type: 'integer' },
                    },
                    additionalProperties: false,
                },
            },
        },
        ProjectFileController.deleteFile
    );

    fastify.delete(
        '/files/:id',
        {
            preHandler: requireAuth,
            schema: {
                params: projectIdParam,
            },
        },
        ProjectFileController.deleteFile
    );
}

module.exports = projectsRoutes;
