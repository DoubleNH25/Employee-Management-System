import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const SalaryChart = ({ dashboardData }) => {
    const chartData = []
    
    if (dashboardData && dashboardData.tasks) {
        const tasks = dashboardData.tasks;
        chartData.push(
            { 
                category: "Pending", 
                count: tasks.pendingTasks,
                color: "hsl(var(--chart-1))"
            },
            { 
                category: "In Progress", 
                count: tasks.inProgressTasks,
                color: "hsl(var(--chart-2))"
            },
            { 
                category: "Completed", 
                count: tasks.completedTasks,
                color: "hsl(var(--chart-3))"
            }
        )
    } else {
        chartData.push(
            { category: "Pending", count: 0 },
            { category: "In Progress", count: 0 },
            { category: "Completed", count: 0 }
        )
    }

    const chartConfig = {
        desktop: {
            label: "Task Count",
            color: "hsl(var(--chart-1))",
        },
        mobile: {
            label: "Task Status",
            color: "hsl(var(--chart-2))",
        },
    }

    return (
        <div className="salary-container flex flex-col min-[250px]:gap-3 sm:gap-1 h-auto">
            <div className="heading px-2 my-2 min-[250px]:px-3">
                <h1 className="min-[250px]:text-xl xl:text-3xl font-bold min-[250px]:text-center sm:text-start">Task Overview</h1>
            </div>
            <Card className="mx-2">
                <CardHeader>
                    <CardTitle className="min-[250px]:text-xs sm:text-md md:text-lg lg:text-xl">
                        Task Statistics: {dashboardData?.tasks?.totalTasks || 0} Total Tasks
                    </CardTitle>
                    <CardDescription className="min-[250px]:text-xs sm:text-md md:text-lg lg:text-xl">
                        Task Management Overview
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="category"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 8)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" className="p-2" />}
                                className="p-[2px] flex gap-1 items-center min-[250px]:text-xs sm:text-xs"
                            />
                            <Area
                                dataKey="count"
                                type="natural"
                                fill="var(--color-desktop)"
                                fillOpacity={0.4}
                                stroke="var(--color-desktop)"
                                stackId="a"
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter>
                    <div className="flex w-full items-start gap-2 text-sm">
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 font-medium leading-none">
                                Task Management System Active
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                {dashboardData?.tasks ? 
                                    `${dashboardData.tasks.completedTasks} completed, ${dashboardData.tasks.overdueTasks} overdue` :
                                    'Ready for task assignments'
                                }
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}