export default function turnDataIntoAction(data: string, prefix: string) {
  return `${prefix}_${data}`
}