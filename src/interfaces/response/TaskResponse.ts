import TeamMember from "./TeamMember";

interface TaskResponse {
    id: number,
    name: string,
    description?: string,
    user_assigned?: TeamMember
}

export default TaskResponse;