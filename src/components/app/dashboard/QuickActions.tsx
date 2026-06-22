import Card from '@/components/shared/Card'
import { Button } from '@/components/ui/button'
import { Boxes, FileSpreadsheet, Plus } from 'lucide-react'
import Link from 'next/link'


const QuickActions = () => {
    return (
        <Card className="lg:col-span-5" title='Quick Actions' subtitle='Common tasks with one-click routing'>
            <div className="flex flex-col gap-4">
                <Button>
                    <Plus size={18} strokeWidth={2.5} />
                    Add Student
                </Button>

                <Link
                    href={"/grouping"}
                    className="h-12 w-full flex items-center justify-center gap-2 hover:bg-orange-500/10 transition rounded-lg font-semibold tracking-wider text-sm bg-transparent border border-orange-500 text-orange-500 cursor-pointer"
                >
                    <Boxes size={18} />
                    Generate Groups
                </Link>

                <Link
                    href={"/assignments"}
                    className="h-12 w-full flex items-center justify-center gap-2 hover:bg-orange-500/10 transition rounded-lg font-semibold tracking-wider text-sm bg-transparent border border-orange-500 text-orange-500 cursor-pointer"
                >
                    <FileSpreadsheet size={18} />
                    Create Assignment
                </Link>
            </div>
        </Card>
    )
}

export default QuickActions