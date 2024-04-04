import { Dialog } from '@radix-ui/themes'

export function Modal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Close>Close</Dialog.Close>
        <p>Content</p>
      </Dialog.Content>
    </Dialog.Root>
  )
}
