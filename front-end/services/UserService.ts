import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UserType } from "@types";

const postRegisterData = async (userData: UserType, router: AppRouterInstance) => {
    // try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/users/register", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
            // .then((response) => response.json())
            // .then((data) => {
            //     sessionStorage.setItem(
            //         "loggedInUser",
            //         JSON.stringify({
            //             token: data.token,
            //             user: {
            //                 id: data.user.id,
            //                 name: data.user.username,
            //             },
            //         })
            //     );
            //     return { status: 200, data: data };
            // });
    // } catch (err) {
    //     router.back();
    //     return { status: 500, data: err};
    // } 
    return response;
};

export default { postRegisterData };