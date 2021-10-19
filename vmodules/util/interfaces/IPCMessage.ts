export default interface IPCMessage {
  t: 'LOG' | string,
  c: {
    content: any,
    level?: string,
    file?: string,
    prefix?: string
  }
}