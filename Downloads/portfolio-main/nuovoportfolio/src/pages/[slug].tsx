import type { GetStaticPaths, GetStaticProps } from "next";
import { Gallery } from "@/components/Gallery";
import { NextProject } from "@/components/NextProject";
import { PageTransition } from "@/components/PageTransition";
import { ProjectHero } from "@/components/ProjectHero";
import { localizeProject, type Project, projects } from "@/data/projects";
import { homeSeo, SITE_URL } from "@/data/site";
import { plainText } from "@/lib/emphasis";
import { useLanguage } from "@/lib/language";

export default function ProjectPage({ project: base }: { project?: Project }) {
  const { lang } = useLanguage();
  if (!base) return null;
  const project = localizeProject(base, lang);
  return (
    <PageTransition>
      <ProjectHero project={project} />
      <Gallery rows={project.gallery} />
      {project.href && <NextProject currentHref={project.href} />}
    </PageTransition>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: projects.map((p) => ({ params: { slug: p.href } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const project = projects.find((p) => p.href === params?.slug);
  if (!project) return { notFound: true };
  return {
    props: {
      project,
      seo: Object.fromEntries(
        (["en", "it"] as const).map((lang) => [
          lang,
          {
            title: `${project.title} | Claudia Napolitano`,
            description: plainText(localizeProject(project, lang).description),
            canonical: `${SITE_URL}/${project.href}`,
            image: homeSeo.image,
            noindex: true,
          },
        ]),
      ),
    },
  };
};
