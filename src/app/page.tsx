import MainLayout from '@/components/layout/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <div>
        {/* Welcome section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to CoderTools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Your collection of 100+ free developer tools, all running client-side for privacy and speed.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
              🚀 Getting Started
            </h2>
            <p className="text-blue-800 dark:text-blue-400">
              Select a tool from the sidebar to get started. All tools work entirely in your browser - 
              no data is sent to our servers, ensuring your privacy and security.
            </p>
          </div>
        </div>

        {/* Featured tools */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <ToolCard
            title="JSON Formatter"
            description="Format, validate, and beautify JSON data with syntax highlighting"
            href="/tools/json-formatter"
            icon="🔧"
          />
          <ToolCard
            title="Base64 Encoder/Decoder"
            description="Encode and decode Base64 strings quickly and easily"
            href="/tools/base64"
            icon="🔄"
          />
          <ToolCard
            title="JWT Decoder"
            description="Decode and inspect JWT tokens to view their contents"
            href="/tools/jwt-decoder"
            icon="🔍"
          />
          <ToolCard
            title="UUID Generator"
            description="Generate unique identifiers in various formats"
            href="/tools/uuid-generator"
            icon="🆔"
          />
          <ToolCard
            title="Unix Timestamp Converter"
            description="Convert between Unix timestamps and human-readable dates"
            href="/tools/timestamp-converter"
            icon="⏰"
          />
          <ToolCard
            title="CSV to JSON Converter"
            description="Convert CSV data to JSON format with customizable options"
            href="/tools/csv-to-json"
            icon="📊"
          />
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <FeatureCard
            icon="🔒"
            title="Privacy First"
            description="All tools run in your browser. No data is sent to our servers."
          />
          <FeatureCard
            icon="⚡"
            title="Lightning Fast"
            description="Client-side processing means instant results with no waiting."
          />
          <FeatureCard
            icon="📱"
            title="Mobile Friendly"
            description="Responsive design that works perfectly on all devices."
          />
        </div>

        {/* Ad placeholder */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl h-24 bg-gray-100 dark:bg-gray-800 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Content Ad Space (500x120)</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
}

function ToolCard({ title, description, href, icon }: ToolCardProps) {
  return (
    <a
      href={href}
      className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200"
    >
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {description}
      </p>
    </a>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="text-center">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
