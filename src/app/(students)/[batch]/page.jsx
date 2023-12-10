import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

export async function generateStaticParams() {
  const batchesDir = "src/batches";
  const files = fs.readdirSync(path.join(process.cwd(), batchesDir));
  return files.map((filename) => ({ batch: filename.replace(".mdx", "") }));
}

const Page = async ({ params }) => {
  
  const { batch } = params;
  const batchesDir = `src/${batch}`;
  const files = fs.readdirSync(path.join(process.cwd(), batchesDir));
  const lessons = files.map((filename) => {
    const fileContent = fs.readFileSync(
      path.join(batchesDir, filename),
      "utf-8"
    );
    const { data: frontMatter } = matter(fileContent);
    return {
      meta: frontMatter,
      slug: filename.replace(".mdx", ""),
    };
  });

  return (
    <div>
      {lessons.map((lesson) => {
        return (
          <Link key={lesson.slug} passHref href={`${batch}/${lesson.slug}`}>
            <h2>{lesson.meta.title}</h2>
          </Link>
        );
      })}
    </div>
  );
};

export default Page;
