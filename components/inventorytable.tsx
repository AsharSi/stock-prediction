"use client";
import type React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  getInventoryItemById,
  getInventoryItems,
} from "@/actions/inventoryActions";
import Loader from "./loader";

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
  probability: number;
}

const url = "http://10.145.153.156:8000/";

export default function InventorySearchForm() {
  const [itemId, setItemId] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [predictionType, setPredictionType] = useState("predict_precision");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);

  const getShortageProb = async (items: InventoryItem[]) => {
    setIsLoading(true);
    try {
      if (!date) {
        console.error("Date is not selected.");
        return;
      }

      const dateSplit = {
        day_of_week: date.getDay(),
        month: date.getMonth() + 1,
        quarter: Math.floor(date.getMonth() / 3) + 1,
        year: date.getFullYear(),
        is_weekend: date.getDay() === 0 || date.getDay() === 6 ? 1 : 0,
      };

      console.log("Date split:", dateSplit);

      const promises = items.map(async (item) =>
        fetch(url + predictionType, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              ...item,
              ...dateSplit,
            },
          }),
        })
          .then(async (res) => {
            const data = await res.json();
            if (res.ok) {
              return {
                ...item,
                probability: data.probability,
              };
            } else {
              console.error("Error fetching shortage probability:", data);
              return item;
            }
          })
          .catch((error) => {
            console.error("Error fetching shortage probability:", error);
            return item;
          })
      );

      const result = await Promise.all(promises);

      console.log("Fetched shortage probabilities:", result);

      setInventoryData(result);
    } catch (error) {
      console.error("Error fetching shortage probability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let res: InventoryItem[] | null = null;

    if (!itemId) {
      res = await getInventoryItems(1, 50);
    } else {
      res = await getInventoryItemById(Number(itemId));
    }

    if (!res) {
      console.error("Failed to fetch inventory items.");
      return;
    }

    await getShortageProb(res);

    setSearchPerformed(true);
  };

  // Sort inventory data by probability in descending order
  const sortInventoryData = (method: string) => {
    const sortedData = [...inventoryData].sort(
      (a, b) =>
        b[method as keyof InventoryItem] - a[method as keyof InventoryItem]
    );
    setInventoryData(sortedData);
  };

  // Format decimal numbers to a consistent format
  const formatDecimal = (value: number) => {
    return value.toFixed(6);
  };

  return (
    <div className="container mx-auto py-8">
      {isLoading && <Loader />}
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
              <PopoverTrigger asChild className="">
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left bg-transparent font-normal",
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

          <div>
            <Label htmlFor="predictionType" className="mb-2">
              Prediction Type
            </Label>
            <Select
              defaultValue="predict_precision"
              onValueChange={setPredictionType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="predict_precision">Precision</SelectItem>
                  <SelectItem value="predict_recall">Recall</SelectItem>
                  <SelectItem value="predict_hybrid">Hybrid</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
              {inventoryData.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted border-b">
                          <th
                            className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                            onClick={() => sortInventoryData("item_encoded")}
                          >
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
                          <th
                            className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                            onClick={() =>
                              sortInventoryData("max_shortage_qty")
                            }
                          >
                            Max Shortage Qty
                          </th>
                          <th
                            className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                            onClick={() =>
                              sortInventoryData("total_shortage_qty")
                            }
                          >
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
                          <th
                            className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                            onClick={() => sortInventoryData("probability")}
                          >
                            Probability
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryData.map((item) => (
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
                            <td className="p-4 align-middle">
                              {formatDecimal(item.probability)}
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
