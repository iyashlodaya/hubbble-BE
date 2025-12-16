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
