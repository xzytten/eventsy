import type { FC } from 'react';
import bgImage from '@/assets/portfolio_1.png';
const PortfolioPage: FC = () => {
    return (
        <div className='flex flex-col items-center'>
            <div className='w-full  flex flex-col  items-start justify-end gap-10  bg-cover bg-center bg-no-repeat h-[650px]'
                style={{ backgroundImage: `url(${bgImage})` }}>
                <h2 className="text-5xl font-bold ml-26 mb-5">Весілля Анни та Савелія</h2>
            </div>
            <div className='flex flex-col w-full mt-10 pl-26'>
                <h3 className="text-4xl font-bold text-coral ml-0 mb-10">Про проєкт</h3>
                <p className='max-w-260 text-xl  text-text-milk mb-10'>Весілля, яке багато хто запам'ятає як еталон ніжності, любові та командної роботи. Усе почалося досить весело, коли наречена Анна надіслала нам листа на е-мейл. Було прописано багато деталей організації, переваг і бюджетних урочистостей, але на підготовку нам виділили всього 3 тижні, а самі молоді весь цей час перебували за кордоном. З одного боку складно, з іншого - страшенно цікаво.</p>
                <p className='max-w-260 text-xl  text-text-milk'>
                    Питання з документами, фінансами та організацією ми вирішували на відстані. Анна вибирала з декількох варіантів локацій. Вибір зупинився на заміському комплексі Grand Admiral у прекрасному місці під Києвом із соснами з високим запахом, які перенесли гостей у казку. Навколо росли невеликі акуратні кущі та дерева, а на вільній галявині ми розмістили гостей на стільцях, прикрашених бежевим шовком, ніжну арку для молодят та інші декорації.</p>
            </div>
        </div>
    );
};

export default PortfolioPage; 