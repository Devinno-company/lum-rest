interface Task {
    cd_task: number,
    nm_task: string,
    id_completed: boolean,
    ds_task: string,
    cd_event: number,
    cd_access_user?: number
}

export default Task;