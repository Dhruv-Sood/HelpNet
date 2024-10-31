import Link from 'next/link'
import { BoxReveal } from './ui/box-reveal';
import Earth from './3d_models/earth';
import Help from './3d_models/help';
import { MagicCard } from './ui/magic-card';

export function HomePage() {
  return (
    <div className='min-h-screen bg-black'>
      {/* Hero Section */}
      <div className='container mx-auto px-4 h-screen flex items-center'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div className='order-2 lg:order-1'>
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <h1 className="text-5xl font-bold mb-6 text-white leading-tight">
                Welcome to DisasterRelief.info
              </h1>
            </BoxReveal>
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <p className="text-xl mb-8 text-gray-300">
                Help communities by sharing and verifying disaster relief information.
              </p>
            </BoxReveal>
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <p className="text-lg text-gray-400 leading-relaxed mb-8">
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
                    className="bg-zinc-800 text-white px-6 py-3 rounded-lg hover:bg-zinc-700 transition-colors duration-200 text-center"
                  >
                    Upload Information
                  </Link>
                  <Link
                    href="/verify" 
                    className="bg-zinc-800 text-white px-6 py-3 rounded-lg hover:bg-zinc-700 transition-colors duration-200 text-center"
                  >
                    Verify Information
                  </Link>
                </div>
                <Link
                  href="/verifiedInfo"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
                >
                  Verified Info
                </Link>
              </div>
            </BoxReveal>
          </div>
          
          <div className='order-1 lg:order-2 h-full'>
            {/* <Earth /> */}
            Earth Model
            {/* <Help /> */}
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Key Features</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <MagicCard className="bg-[#19191778] text-white border-0 h-full min-h-[228px]">
            <div className="p-4">
              <h2 className="text-3xl font-bold text-center">Information Upload</h2>
              <p className="text-xl p-4 text-center">
                Share critical disaster relief information with affected communities.
                Help coordinate aid efforts by providing accurate, timely updates.
              </p>
            </div>
          </MagicCard>
          <MagicCard className="bg-[#19191778] text-white border-0 h-full min-h-[228px]">
            <div className="p-4">
              <h2 className="text-3xl font-bold text-center">Community Verification</h2>
              <p className="text-xl p-4 text-center">
                Verify information shared by others to ensure accuracy.
                Build trust through community-driven fact-checking.
              </p>
            </div>
          </MagicCard>

          <MagicCard className="bg-[#19191778] text-white border-0 min-h-[228px]">
            <div className="p-4">
              <h2 className="text-3xl font-bold text-center">Reward System</h2>
              <p className="text-xl p-4 text-center">
                Earn cryptocurrency rewards for contributing reliable information.
                Get rewarded for helping verify and maintain data accuracy.
              </p>
            </div>
          </MagicCard>
        </div>

        
      </div>
      {/* Below Hero section */}
      <div className="py-16 rounded-lg">
        <h1 className="text-4xl font-bold mb-8 text-white text-center tracking-wide">How it works</h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-300 text-xl leading-relaxed space-y-4 font-light">
            This site is a platform for sharing and verifying disaster relief information. It allows you to upload and verify information about disaster relief efforts, ensuring that you are providing the most accurate and helpful information to those in need.
          </p>
          <div className="mt-6 space-y-4 text-gray-400">
            <p className="text-lg leading-relaxed font-light">
              On uploading and verifying, users get rewarded via cryptocurrency. If the uploader receives about 80% positive verifications within 5 hours, they earn the reward.
            </p>
            <p className="text-lg leading-relaxed font-light">
              The reward is distributed in the form of cryptocurrency directly to the user's wallet.
            </p>
            <p className="text-lg leading-relaxed font-light">
              Verifiers also earn cryptocurrency rewards when they consistently provide accurate verifications and maintain a high verification accuracy rate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}