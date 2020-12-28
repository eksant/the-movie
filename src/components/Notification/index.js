import { notification } from 'antd'

export default function Notification(success, message) {
  return notification[success ? 'success' : 'warning']({
    message: 'Message',
    description: message,
    style: { top: '50px' },
  })
}
