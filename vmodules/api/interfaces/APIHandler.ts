export default interface APIHandler {
  route: string,
  method: string,
  run: ((req: any, res: any) => void) | null;
}