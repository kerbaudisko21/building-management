import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const currentYear = new Date().getFullYear();
        // const apiKey = 'qLMCgBSuBVrQzHZPTwGjHE1eMpd8Z5NJ';
        const apiKey = 'error';

        const response = await fetch(
            `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=ID&year=${currentYear}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Cache for 24 hours
                next: { revalidate: 86400 }
            }
        );

        if (!response.ok) {
            throw new Error(`Calendarific API error: ${response.status}`);
        }

        const data = await response.json();

        // Return successful response
        return NextResponse.json(data, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
            },
        });

    } catch (error: any) {
        console.error('Error fetching holidays:', error);

        // Return error response
        return NextResponse.json(
            {
                error: 'Failed to fetch holidays',
                message: error.message
            },
            { status: 500 }
        );
    }
}