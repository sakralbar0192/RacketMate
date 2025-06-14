export default function getDataFromAction(action: string) {
  return (action.split('_')[1] || '')
}