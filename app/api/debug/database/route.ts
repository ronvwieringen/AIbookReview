import { NextRequest, NextResponse } from "next/server";
import { all, get } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Database inspector is only available in development' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');
    const query = searchParams.get('query');

    if (query) {
      // Execute custom query
      const result = await all(query);
      return NextResponse.json({ query, result });
    }

    if (table) {
      // Get data from specific table
      const data = await all(`SELECT * FROM ${table} LIMIT 100`);
      return NextResponse.json({ table, data });
    }

    // Get list of all tables
    const tables = await all(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);

    const tableInfo = {};
    for (const tableRow of tables) {
      const tableName = tableRow.name;
      const count = await get(`SELECT COUNT(*) as count FROM ${tableName}`);
      const schema = await all(`PRAGMA table_info(${tableName})`);
      tableInfo[tableName] = {
        count: count.count,
        schema: schema
      };
    }

    return NextResponse.json({
      tables: tables.map(t => t.name),
      tableInfo
    });
  } catch (error) {
    console.error('Database inspector error:', error);
    return NextResponse.json(
      { error: 'Database inspection failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}