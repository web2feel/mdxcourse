import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
const Page = async () => {
  const batchesDir = "src/batches";
  //const files = fs.readdirSync(path.join(process.cwd(), batchesDir));
  const files = await fs.promises.readdir(path.join(process.cwd(), batchesDir));

  // const batches = files.map((filename) => {
  //   const fileContent = fs.readFileSync(
  //     path.join(process.cwd(), batchesDir, filename),
  //     "utf-8"
  //   );
  //   const { data: frontMatter } = matter(fileContent);
  //   return {
  //     meta: frontMatter,
  //     slug: filename.replace(".mdx", ""),
  //   };
  // });

  const getBatchData = async (filename) => {
    const fileContent = await fs.promises.readFile(
      path.join(process.cwd(), batchesDir, filename),
      "utf-8"
    );
    const { data: frontMatter } = matter(fileContent);
    return {
      meta: frontMatter,
      slug: filename.replace(".mdx", ""),
    };
  };
  
  const batches = await Promise.all(files.map(getBatchData));
  
  return (
    <div>
      {batches.map((batch) => {
        return (
          <Link key={batch.slug} href={`/${batch.slug}`}>
            <h2>{batch.meta.title}</h2>
          </Link>
        );
      })}
    </div>
  );
};

export default Page;
