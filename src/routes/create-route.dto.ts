export class CreateRouteDto {
  clientUuid: string;
  durationSeconds: number;
  distanceMeters: number;
  startedAt: string;
  visibility?: string;
  points: { lat: number; lng: number; t: number }[];
}
