import GoGreenSection from "./GoGreenSection";

type PageProps = {
  params: Record<string, string>;
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function Page(_props: PageProps) {
  return <GoGreenSection />;
}
