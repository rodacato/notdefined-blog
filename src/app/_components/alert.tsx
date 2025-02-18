import Container from '@/app/_components/container'
import cn from 'classnames'

type Props = {
  preview?: boolean
}

const Alert = ({ preview }: Props) => {
  return (
    <div
      className={cn('border-b dark:bg-slate-800', {
        'bg-amber-500 border-amber-600 text-white': preview,
        'bg-neutral-50 border-neutral-200': !preview
      })}
    >
      <Container>
        {preview && (
          <div className='py-4 text-center text-base font-medium animate-pulse'>
            ⚠️ Preview Mode Active: This is a draft version of the content and may not reflect the final published version.
          </div>
        )}
      </Container>
    </div>
  )
}

export default Alert
