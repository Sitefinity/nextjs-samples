import Page from './[...slug]/page';

export default async function HomePage({ searchParams }: any) {
    return Page({ params: {slug: []}, searchParams: searchParams || {} });
}
