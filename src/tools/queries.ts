import { gql } from "apollo-server-express";

export const queries = {
  createUser: gql`
    mutation CreateUser($password: String!, $email: String!) {
      createUser(password: $password, email: $email) {
        id
        login
        email
        date_end_subscription
        date_start_subscription
      }
    }
  `,
  getAllUsers: gql`
    query GetAllUsers {
      getAllUsers {
        date_end_subscription
        date_start_subscription
        email
        id
        login
      }
    }
  `,
  getUserById: gql`
    query GetUserById($userId: Float!) {
      getUserById(userId: $userId) {
        email
        id
        login
        date_end_subscription
        date_start_subscription
      }
    }
  `,
  updateUser: gql`
    mutation Mutation($userId: Float!, $user: iUser!) {
      updateUser(userId: $userId, User: $user) {
        date_end_subscription
        date_start_subscription
        email
        id
        login
      }
    }
  `,
  deleteUser: gql`
    mutation Mutation($userId: Float!) {
      deleteUser(userId: $userId) {
        id
      }
    }
  `,
  getToken: gql`
    query Query($password: String!, $email: String!) {
      getToken(password: $password, email: $email)
    }
  `,

  createProject: gql`
    mutation CreateProject(
      $isPublic: Boolean!
      $description: String!
      $name: String!
      $userId: Float!
    ) {
      createProject(
        isPublic: $isPublic
        description: $description
        name: $name
        userId: $userId
      ) {
        description
        id
        id_storage_number
        isPublic
        name
        nb_views
        nb_likes
      }
    }
  `,
  getAllProjects: gql`
    query GetAllProjects {
      getAllProjects {
        description
        id
        id_storage_number
        isPublic
        name
        nb_likes
        nb_views
      }
    }
  `,
  getProjectById: gql`
    query GetProjectById($projectId: Float!) {
      getProjectById(projectId: $projectId) {
        description
        id
        id_storage_number
        isPublic
        name
        nb_likes
        nb_views
      }
    }
  `,
  updateProject: gql`
    mutation UpdateProject($projectId: Float!, $project: iProject!) {
      updateProject(ProjectId: $projectId, Project: $project) {
        description
        id
        id_storage_number
        isPublic
        name
        nb_likes
        nb_views
      }
    }
  `,
  deleteProject: gql`
    mutation DeleteProject($projectId: Float!) {
      deleteProject(ProjectId: $projectId) {
        id
      }
    }
  `,

  createExecution: gql`
    mutation CreateExecution(
      $executionDate: DateTime!
      $userId: Float!
      $projectId: Float!
      $output: String!
    ) {
      createExecution(
        execution_date: $executionDate
        userId: $userId
        projectId: $projectId
        output: $output
      ) {
        id
      }
    }
  `,

  getAllExecutions: gql`
    query GetAllExecutions {
      getAllExecutions {
        id
        execution_date
        output
      }
    }
  `,

  getExecutionById: gql`
    query GetExecutionById($executionId: Float!) {
      getExecutionById(executionId: $executionId) {
        execution_date
        id
        output
      }
    }
  `,

  updateExecution: gql`
    mutation UpdateExecution($executionId: Float!, $execution: iExecution!) {
      updateExecution(ExecutionId: $executionId, Execution: $execution) {
        execution_date
        id
        output
      }
    }
  `,

  deleteExecution: gql`
    mutation DeleteExecution($executionId: Float!) {
      deleteExecution(ExecutionId: $executionId) {
        execution_date
        id
        output
      }
    }
  `,
};
