"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the type for our inventory data
interface InventoryItem {
  item_encoded: number;
  total_observations: number;
  historical_shortage_prob: number;
  avg_shortage_qty: number;
  max_shortage_qty: number;
  total_shortage_qty: number;
  shortage_qty_7d_avg: number;
  shortage_qty_30d_avg: number;
  shortage_freq_7d: number;
  shortage_freq_30d: number;
  is_shortage: number;
}

// Sample inventory data
const inventoryData: InventoryItem[] = [
  {
    item_encoded: 0,
    total_observations: 744,
    historical_shortage_prob: 0.009408602,
    avg_shortage_qty: 0.080645161,
    max_shortage_qty: 26,
    total_shortage_qty: 60,
    shortage_qty_7d_avg: 0,
    shortage_qty_30d_avg: 0,
    shortage_freq_7d: 0,
    shortage_freq_30d: 0,
    is_shortage: 0,
  },
  {
    item_encoded: 1,
    total_observations: 744,
    historical_shortage_prob: 0.001344086,
    avg_shortage_qty: 0.420698925,
    max_shortage_qty: 313,
    total_shortage_qty: 313,
    shortage_qty_7d_avg: 0,
    shortage_qty_30d_avg: 0,
    shortage_freq_7d: 0,
    shortage_freq_30d: 0,
    is_shortage: 0,
  },
  {
    item_encoded: 2,
    total_observations: 744,
    historical_shortage_prob: 0.010752688,
    avg_shortage_qty: 0.127688172,
    max_shortage_qty: 44,
    total_shortage_qty: 95,
    shortage_qty_7d_avg: 0,
    shortage_qty_30d_avg: 0,
    shortage_freq_7d: 0,
    shortage_freq_30d: 0,
    is_shortage: 0,
  },
  {
    item_encoded: 3,
    total_observations: 744,
    historical_shortage_prob: 0.00672043,
    avg_shortage_qty: 0.045698925,
    max_shortage_qty: 10,
    total_shortage_qty: 34,
    shortage_qty_7d_avg: 0,
    shortage_qty_30d_avg: 0,
    shortage_freq_7d: 0,
    shortage_freq_30d: 0,
    is_shortage: 0,
  },
  {
    item_encoded: 4,
    total_observations: 744,
    historical_shortage_prob: 0.018817204,
    avg_shortage_qty: 0.119623656,
    max_shortage_qty: 56,
    total_shortage_qty: 89,
    shortage_qty_7d_avg: 0,
    shortage_qty_30d_avg: 0,
    shortage_freq_7d: 0,
    shortage_freq_30d: 0,
    is_shortage: 0,
  },
  {
    item_encoded: 5,
    total_observations: 744,
    historical_shortage_prob: 0.009408602,
    avg_shortage_qty: 0.044354839,
    max_shortage_qty: 17,
    total_shortage_qty: 33,
    shortage_qty_7d_avg: 0,
    shortage_qty_30d_avg: 0,
    shortage_freq_7d: 0,
    shortage_freq_30d: 0,
    is_shortage: 0,
  },
];

export default function InventorySearchForm() {
  const [itemId, setItemId] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [filteredData, setFilteredData] = useState<InventoryItem[]>([]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter data based on item ID
    // In a real application, you would fetch data from an API based on both itemId and date
    const filtered = itemId
      ? inventoryData.filter((item) => item.item_encoded.toString() === itemId)
      : inventoryData;

    setFilteredData(filtered);
    setSearchPerformed(true);
  };

  // Format decimal numbers to a consistent format
  const formatDecimal = (value: number) => {
    return value.toFixed(6);
  };

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit} className="space-y-6 text-white">
        <div className="flex items-end justify-items-start gap-8">
          <div className="w-full max-w-md">
            <Label htmlFor="itemId" className="mb-2">
              Item ID
            </Label>
            <Input
              id="itemId"
              placeholder="Enter item ID"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
            />
          </div>

          <div className="">
            <Label htmlFor="date" className="mb-2">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild className="text-black ">
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="border-white border-2">
            Search Inventory
          </Button>
        </div>
      </form>
      {searchPerformed && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>
                Inventory Results
                {itemId && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    for Item ID: {itemId}
                  </span>
                )}
                {date && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    on {format(date, "PPP")}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredData.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted border-b">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Item ID
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Total Observations
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Historical Shortage Prob
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Avg Shortage Qty
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Max Shortage Qty
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Total Shortage Qty
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            7d Avg
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            30d Avg
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            7d Freq
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            30d Freq
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Is Shortage
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item) => (
                          <tr
                            key={item.item_encoded}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="p-4 align-middle">
                              {item.item_encoded}
                            </td>
                            <td className="p-4 align-middle">
                              {item.total_observations}
                            </td>
                            <td className="p-4 align-middle">
                              {formatDecimal(item.historical_shortage_prob)}
                            </td>
                            <td className="p-4 align-middle">
                              {formatDecimal(item.avg_shortage_qty)}
                            </td>
                            <td className="p-4 align-middle">
                              {item.max_shortage_qty}
                            </td>
                            <td className="p-4 align-middle">
                              {item.total_shortage_qty}
                            </td>
                            <td className="p-4 align-middle">
                              {item.shortage_qty_7d_avg}
                            </td>
                            <td className="p-4 align-middle">
                              {item.shortage_qty_30d_avg}
                            </td>
                            <td className="p-4 align-middle">
                              {item.shortage_freq_7d}
                            </td>
                            <td className="p-4 align-middle">
                              {item.shortage_freq_30d}
                            </td>
                            <td className="p-4 align-middle">
                              {item.is_shortage}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No inventory data found for the specified criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
