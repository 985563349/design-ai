import Image from 'next/image';

const TemplatesSection: React.FC = () => {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Start from a template</h3>

      <div className="grid grid-cols-8 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="space-y-2 group cursor-pointer" key={index}>
            <div
              style={{ aspectRatio: '900/1200' }}
              className="relative rounded-xl overflow-hidden"
            >
              <Image
                className="object-cover transform group-hover:scale-105 transition"
                fill
                src="https://utfs.io/f/ULavu7NQL4wK9435sPhKP2opsQwDqhcTymF6ef4rCSxluIb3"
                alt="template"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-filter backdrop-blur-sm bg-black/50">
                <p className="font-medium text-white">Open in editor</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Title</p>
              <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-75 transition">
                Description
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesSection;
