import { getProjects } from '@/services/project-service';
import { ProjectCard } from '@/components/project-card';

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <main className="container mx-auto px-4 py-20 min-h-screen">
      <div className="max-w-3xl mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">Selected Works</h1>
        <p className="text-xl text-gray-400 leading-relaxed font-medium">
          Engineering premium digital experiences at the intersection of design and autonomy.
        </p>
      </div>

      {/* Bento Grid Implementation - 6 Column Desktop with Priority Assets */}
      <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[minmax(200px,auto)] gap-6">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <ProjectCard
              key={project.sys.id}
              data={project.fields}
              index={index}
              // Priority loading for the first two cards to optimize LCP
              priority={index < 2}
            />
          ))
        ) : (
          <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.02]">
            <p className="text-gray-500 font-mono uppercase tracking-widest text-sm">
              Data Stream Empty: Waiting for Contentful Sync
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
