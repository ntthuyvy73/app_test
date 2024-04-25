import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    Image,
    RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const { data: posts, refetch } = useAppwrite(getAllPosts);
    const { data: lastestPosts } = useAppwrite(getLatestPosts);

    const [refeshing, setRefeshing] = useState(false);

    const onRefesh = async () => {
        setRefeshing(true);

        //re-call videos
        await refetch();

        setRefeshing(false);
    };

    //console.log(lastestPosts);

    return (
        <SafeAreaView className="bg-primary  h-full ">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <VideoCard video={item} />}
                ListHeaderComponent={() => (
                    <View className="my-6 px-4 space-y-6">
                        <View className="flex-row justify-center items-center mb-6">
                            <View>
                                <Text className="font-medium text-sm text-gray-100">
                                    Welcome back
                                </Text>
                                <Text className="text-2xl font-psemibold text-white">
                                    {user?.username}
                                </Text>
                            </View>

                            <View className="mt-1.5 ml-2">
                                <Image
                                    source={images.logoSmall}
                                    className="w-9 h-10"
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        <SearchInput />

                        <View className="w-full flex-1 pt-5 pb-8">
                            <Text className="text-lg font-pregular text-gray-100 mb-3">
                                Latest Videos
                            </Text>

                            <Trending posts={lastestPosts} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="No videos created yet"
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refeshing={refeshing}
                        onRefresh={onRefesh}
                    />
                }
            />
        </SafeAreaView>
    );
};

export default Home;
