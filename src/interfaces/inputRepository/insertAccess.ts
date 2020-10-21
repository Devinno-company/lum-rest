interface InsertEvent {
    name: string,
    start_date: string,
    end_date: string,
    description?: string,
    start_time?: string,
    end_time?: string,
    type?: string,
}

export default InsertEvent;