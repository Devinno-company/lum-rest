function haversine(latitudeUm: number, longitudeUm: number, latitudeDois: number, longitudeDois: number): number {

    const distanceLat = (latitudeDois - latitudeUm) * (Math.PI / 180);
    const distanceLon = (longitudeDois - longitudeUm) * (Math.PI / 180);

    const latUmRadiano = latitudeUm * (Math.PI / 180);
    const latDoisRadiano = latitudeDois * (Math.PI / 180);

    const harversine =
        Math.pow(Math.sin(distanceLat / 2), 2) +
        Math.pow(Math.sin(distanceLon / 2), 2) *
        Math.cos(latUmRadiano) * Math.cos(latDoisRadiano);

    const worldRadius = 6371;
    const haversine2 = 2 * Math.asin(Math.sqrt(harversine));

    const distance = worldRadius * haversine2;

    return distance;
}

export default haversine;