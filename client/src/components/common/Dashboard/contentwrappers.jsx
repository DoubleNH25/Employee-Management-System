import { KeyDetailsBox } from "./keydetailboxes"

export const ContentWraperMain = ({ children }) => {
    return (
        <div className="container h-full w-auto flex flex-col">
            {children ? children : null}
        </div>
    )
}

export const KeyDetailBoxContentWrapper = ({ imagedataarray, data }) => {
    return (
        <div className="key-details-box-content grid min-[250px]:grid-cols-1 sm:grid-cols-2 gap-4">
            {imagedataarray.map((item, index) => (
                <div key={index}>
                    <KeyDetailsBox 
                        image={item.image} 
                        dataname={item.dataname} 
                        data={data ? data[item["dataname"]] : ""}
                    />
                </div>
            ))}
        </div>
    )
}
