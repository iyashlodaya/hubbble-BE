const ProjectController = require('../controllers/project.controller.js');
const requrieAuth = require('../middlewares/requrieAuth');

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


async function projectsRoutes(fastify) {
    fastify.post(
        '/projects',
        {
            preHandler: requrieAuth,
            schema: {
                body: createProjectSchema.body,
            },
        },
        ProjectController.createProject
    );

    fastify.get(
        '/projects',
        {
            preHandler: requrieAuth,
            schema: {
                response: listProjectsResponse,
            },
        },
        ProjectController.listProjects
    );

    fastify.get(
        '/projects/:id',
        {
            preHandler: requrieAuth,
            schema: {
                params: projectIdParam,
            },
        },
        ProjectController.getProjectById
    );

    fastify.delete(
        '/projects/:id',
        {
            preHandler: requrieAuth,
            schema: {
                params: projectIdParam,
            },
        },
        ProjectController.deleteProject
    );
}

module.exports = projectsRoutes;
