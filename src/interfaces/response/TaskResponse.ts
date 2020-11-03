import TeamMember from "./TeamMember";

interface TaskResponse {
    id: number,
    name: string,
    completed: boolean,
    description?: string,
    user_assigned: TeamMember | null
}

export default TaskResponse;