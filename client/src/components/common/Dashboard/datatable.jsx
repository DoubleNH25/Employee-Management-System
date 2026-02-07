import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
export const DataTable = ({ noticedata }) => {
    const Notices = []

    if (noticedata && noticedata.notices && Array.isArray(noticedata.notices)) {
        for (let index = 0; index < noticedata.notices.length; index++) {
            Notices.push(
                {
                    noticeID: index + 1,
                    noticeTitle: noticedata.notices[index].title,
                    noticeAudience: noticedata.notices[index].audience,
                    noticeCreatedBy: `${noticedata.notices[index].createdby["firstname"]} ${noticedata.notices[index].createdby["lastname"]}`,
                }
            )
        }
    } else {
        Notices.push(
            {
                noticeID: 1,
                noticeTitle: "Task Management System Ready",
                noticeAudience: "All Employees",
                noticeCreatedBy: "System Admin"
            },
            {
                noticeID: 2,
                noticeTitle: "Welcome to TechCorp Solutions",
                noticeAudience: "All Employees", 
                noticeCreatedBy: "HR Department"
            }
        )
    }

    return (

        <div className="overflow-auto h-full">
            <div className="notices-heading mx-3 my-2">
                <p className="min-[250px]:text-xl xl:text-3xl font-bold min-[250px]:text-center sm:text-start">System Announcements</p>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Audience</TableHead>
                        <TableHead className="text-right">Created By</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>

                    {Notices.map((Notice) => (
                        <TableRow key={Notice.noticeID}>
                            <TableCell className="font-medium">{Notice.noticeID}</TableCell>
                            <TableCell>{Notice.noticeTitle}</TableCell>
                            <TableCell>{Notice.noticeAudience}</TableCell>
                            <TableCell className="text-right">{Notice.noticeCreatedBy}</TableCell>
                        </TableRow>
                    ))}

                </TableBody>

                {/* <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
            </TableFooter> */}
            </Table>
        </div>
    )
}