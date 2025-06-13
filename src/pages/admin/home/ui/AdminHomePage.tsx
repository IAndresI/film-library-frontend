import { motion } from 'framer-motion';

import { Chart } from '@/pages/admin/home/ui/Chart';

import { Separator } from '@/shared/ui/separator';
import { SvgFire } from '@/shared/ui/svg/SvgFire';
import { SvgReview } from '@/shared/ui/svg/SvgReview';
import { SvgUsers } from '@/shared/ui/svg/SvgUsers';

const cards = [
  {
    title: 'Total users',
    icon: SvgUsers,
    value: '+2350',
    percentage: 20.1,
  },
  {
    title: 'Total films',
    icon: SvgFire,
    value: '+100',
    percentage: 120,
  },
  {
    title: 'Total reviews',
    icon: SvgReview,
    value: '-59',
    percentage: -5.56,
  },
];

export const AdminHomePage = () => {
  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={'home'}
    >
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Analytic data</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="mb-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-card text-card-foreground rounded-xl border shadow"
            >
              <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                <div className="text-sm font-medium tracking-tight">
                  {card.title}
                </div>
                <card.icon className="text-muted-foreground h-4 w-4" />
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-muted-foreground text-xs">
                  {card.percentage < 0 ? '' : '+'}
                  {card.percentage}% from last month
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-card text-card-foreground col-span-4 rounded-xl border shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="leading-none font-semibold tracking-tight">
              New users
            </div>
          </div>
          <div className="p-6 pt-0 pl-2">
            <Chart />
          </div>
        </div>
      </div>
    </motion.section>
  );
};
