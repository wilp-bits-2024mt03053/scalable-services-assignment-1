import { FlipWords } from './ui/flip-words';

const words = ['websites', 'store', 'blogs', 'apps'];
const FlipWordsDemo = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="text-4xl font-normal  text-white text-center max-w-2xl">
        Build real-time{' '}
        <FlipWords words={words} duration={2500} className="text-red-500 font-semibold" />{' '}
        monitoring with ease.
      </div>
    </div>
  );
};
export default FlipWordsDemo;
