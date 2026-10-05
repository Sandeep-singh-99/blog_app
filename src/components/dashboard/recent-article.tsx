import RecentNotes from "./recent-notes";
export default function RecentArticle({ articles }: { articles: any }) {
  return <RecentNotes notes={articles} />;
}
