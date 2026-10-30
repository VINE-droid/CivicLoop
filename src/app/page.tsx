import { redirect } from 'next/navigation';

// Root → redirect to /report (citizen default landing)
export default function HomePage() {
  redirect('/report');
}
