import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Built for Teachers',
    Svg: require('@site/static/img/undraw_teacher.svg').default,
    description: (
      <>
        Create decks, organize classes, and share materials with students in
        minutes.
      </>
    ),
  },
  {
    title: 'Designed for Long-Term Learning',
    Svg: require('@site/static/img/undraw_calendar.svg').default,
    description: (
      <>
        Adaptive scheduling inspired by Leitner-Box helps students review at the
        right time, not just the next time.
      </>
    ),
  },
  {
    title: 'Study Anywhere',
    Svg: require('@site/static/img/undraw_study_anywhere.svg').default,
    description: (
      <>
        Use Noava in the classroom and at home, we keep your progress consistent
        across devices.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
