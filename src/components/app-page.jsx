import Link from 'next/link'
import { BoxReveal } from './ui/box-reveal';
import Earth from './3d_models/earth';
import Help from './3d_models/help';
import { MagicCard } from './ui/magic-card';

export function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-black to-zinc-900'>
      {/* Hero Section */}
      <div className='container mx-auto px-4 min-h-screen flex items-center'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div className='order-2 lg:order-1'>
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text leading-tight">
                Welcome to HelpNet (Disaster Relief)
              </h1>
            </BoxReveal>
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <p className="text-2xl mb-8 text-gray-200">
                Help communities by sharing and verifying disaster relief information.
              </p>
            </BoxReveal>
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <p className="text-lg text-gray-300 leading-relaxed mb-8 backdrop-blur-sm bg-zinc-900/30 p-6 rounded-xl border border-zinc-800">
                We focus on providing accurate and up-to-date information about disaster relief efforts.
                Our platform allows you to upload and verify information about disaster relief efforts,
                ensuring that you are providing the most accurate and helpful information to those in need.
              </p>
            </BoxReveal>
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/upload"
                    className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 text-center shadow-lg hover:shadow-blue-500/25 font-medium"
                  >
                    Upload Information
                  </Link>
                  <Link
                    href="/verify" 
                    className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 text-center shadow-lg hover:shadow-purple-500/25 font-medium"
                  >
                    Verify Information
                  </Link>
                </div>
                <Link
                  href="/verifiedInfo"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-900 transition-all duration-300 text-center shadow-lg hover:shadow-emerald-500/25 font-medium"
                >
                  View Verified Info
                </Link>
              </div>
            </BoxReveal>
          </div>
          
          <div className='order-1 lg:order-2 h-full flex justify-center items-center'>
            <Earth />
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Key Features</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <MagicCard className="bg-gradient-to-b from-black/95 to-zinc-950/90 backdrop-blur-xl text-white border border-zinc-800/50 h-full min-h-[280px] hover:scale-105 transition-transform duration-300">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">Information Upload</h2>
              <p className="text-xl text-center text-gray-300">
                Share critical disaster relief information with affected communities.
                Help coordinate aid efforts by providing accurate, timely updates.
              </p>
            </div>
          </MagicCard>
          <MagicCard className="bg-gradient-to-b from-black/95 to-zinc-950/90 backdrop-blur-xl text-white border border-zinc-800/50 h-full min-h-[280px] hover:scale-105 transition-transform duration-300">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">Community Verification</h2>
              <p className="text-xl text-center text-gray-300">
                Verify information shared by others to ensure accuracy.
                Build trust through community-driven fact-checking.
              </p>
            </div>
          </MagicCard>

          <MagicCard className="bg-gradient-to-b from-black/95 to-zinc-950/90 backdrop-blur-xl text-white border border-zinc-800/50 h-full min-h-[280px] hover:scale-105 transition-transform duration-300">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">Reward System</h2>
              <p className="text-xl text-center text-gray-300">
                Earn cryptocurrency rewards for contributing reliable information.
                Get rewarded for helping verify and maintain data accuracy.
              </p>
            </div>
          </MagicCard>
        </div>
      </div>

      {/* How it works section */}
      <div className="py-20 rounded-lg backdrop-blur-sm bg-zinc-900/30">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">How it works</h1>
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-gray-200 text-2xl leading-relaxed mb-12 text-center">
            This site is a platform for sharing and verifying disaster relief information. It allows you to upload and verify information about disaster relief efforts, ensuring that you are providing the most accurate and helpful information to those in need.
          </p>
          <div className="space-y-8 text-gray-300">
            <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-900/50 p-8 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
              <p className="text-lg leading-relaxed">
                On uploading and verifying, users get rewarded via cryptocurrency. If the uploader receives about 80% positive verifications within 5 hours, they earn the reward.
              </p>
            </div>
            <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-900/50 p-8 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
              <p className="text-lg leading-relaxed">
                The reward is distributed in the form of cryptocurrency directly to the user's wallet.
              </p>
            </div>
            <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-900/50 p-8 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
              <p className="text-lg leading-relaxed">
                Verifiers also earn cryptocurrency rewards when they consistently provide accurate verifications and maintain a high verification accuracy rate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}