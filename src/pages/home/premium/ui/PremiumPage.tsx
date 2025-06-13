import { motion } from 'framer-motion';

import { useUser } from '@/app/providers';

import { UserSubscriptionPaymentForm } from '@/features/subscriptionPurchase/ui';

import { SubscriptionStatus } from '@/entities/subscription/dto';

import { SvgCrown } from '@/shared/ui/svg/SvgCrown';

export const PremiumPage = () => {
  const user = useUser();

  const haveSubscription =
    user.subscription &&
    user.subscription.subscriptionStatus === SubscriptionStatus.ACTIVE;

  return (
    <motion.section
      className="col-span-3 lg:col-span-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={'premium'}
    >
      <div className="flex flex-col items-center justify-center gap-4 px-5 pt-20 pb-12">
        <h1 className="text-[60px] font-extrabold uppercase">
          {haveSubscription && 'Вы уже'}{' '}
          <span className="rainbow-text">Premium</span>
        </h1>
        {!haveSubscription && (
          <h2 className="text-2xl font-semibold">
            Получите безлимитный доступ ко всем кино-новинкам!
          </h2>
        )}
      </div>
      {haveSubscription ? (
        <SvgCrown
          className="mx-auto h-60 w-60"
          gradient
        />
      ) : (
        <UserSubscriptionPaymentForm />
      )}
    </motion.section>
  );
};
