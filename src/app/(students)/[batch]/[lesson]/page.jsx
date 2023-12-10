import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
const components = {
  h1: (props) => (
    <h1 {...props} style={{fontSize:"5em"}}>
      {props.children}
    </h1>
  ),
}
export async function generateStaticParams() {
  const lessonParams = [];
  const batchesDir = "src/batches";
  const batchFiles = fs
    .readdirSync(path.join(process.cwd(), batchesDir))
    .map((batchFile) => batchFile.replace(".mdx", ""));
  for (const batch of batchFiles) {
    const lessonFiles = fs
      .readdirSync(path.join(process.cwd(), "src", batch))
      .map((lesson) => lesson.replace(".mdx", ""));
    for (const lesson of lessonFiles) {
      lessonParams.push({ batch, lesson });
    }
  }
  return lessonParams;
}

const Page = async ({ params }) => {
  const { batch, lesson } = params;
  const fileContent = fs.readFileSync(
    path.join(process.cwd(), "src", batch, `${lesson}.mdx`),
    "utf-8"
  );
  const { frontmatter: data, content } = await compileMDX({
    source: fileContent,
 
    options: { parseFrontmatter: true },
  });
  return (
    <div className="prose">
      <h1>{data.title}</h1>
      {content}
    </div>
  );
};

export default Page;
