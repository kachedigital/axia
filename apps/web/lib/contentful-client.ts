import { createClient } from 'contentful';

const spaceId = process.env.CONTENTFUL_SPACE_ID || 'placeholder';
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN || 'placeholder';

if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    console.warn('Missing Contentful configuration variables.');
}

export const client = createClient({
    space: spaceId,
    accessToken: accessToken,
});
