import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href='https://cacdia.github.io' target='_blank' rel='noopener noreferrer'>
      <Image src='/cacdia.png' alt='cacdia logo' width={32} height={32} />
    </Link>
  );
}
