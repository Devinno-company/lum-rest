interface Material {
    cd_material: number,
    nm_material: string,
    qt_material: number,
    qt_acquired: number,
    ds_observation?: string,
    cd_event: number,
    sg_status: string
}

export default Material;