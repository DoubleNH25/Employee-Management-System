import { Users, Briefcase } from "lucide-react"

export const KeyDetailsBox = ({image, dataname, data}) => {
    const getIcon = () => {
        if (dataname === 'employees') {
            return <Users className="w-12 h-12 text-purple-600" />
        } else if (dataname === 'departments') {
            return <Briefcase className="w-12 h-12 text-purple-600" />
        }
        return <img src={image} alt={dataname} className="w-12 h-12"/>
    }

    return (
        <div className="keydetail-box-container w-full">
            <div className="keydetails-content bg-white border-2 border-purple-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6">
                <div className="flex items-center justify-between">
                    <div className="data-name-group flex flex-col gap-2">
                        <div className="data">
                            <p className="text-4xl font-bold text-gray-900">{data}</p>
                        </div>
                        <div className="dataname">
                            <p className="text-lg font-medium text-gray-600 capitalize">{dataname}</p>
                        </div>
                    </div>

                    <div className="data-icon bg-purple-100 p-4 rounded-xl">
                        {getIcon()}
                    </div>
                </div>
            </div>
        </div>
    )
}
