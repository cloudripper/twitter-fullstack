module Api
    class TweetsController < ApplicationController
        def index
        @tweets = Tweet.all.order(created_at: :desc)
        render 'tweets/index'
        end
    
        def create
            token = cookies.signed[:twitter_session_token]
            session = Session.find_by(token: token)
            user = session.user
            @tweet = user.tweets.new(tweet_params)
            
            if params[:tweet][:image]
                @tweet.image.attach(params[:tweet][:image])
            end 

            if @tweet.save
                #TweetMailer.notify(@tweet).deliver!
                render 'tweets/create'
            else 
                return render json: { success: false, message: @tweet } 
            end
        end
    
        def destroy
        token = cookies.signed[:twitter_session_token]
        session = Session.find_by(token: token)
    
        return render json: { success: false } unless session
    
        user = session.user
        tweet = Tweet.find_by(id: params[:id])
    
        if tweet and tweet.user == user and tweet.destroy
            render json: {
            success: true
            }
        else
            render json: {
            success: false
            }
        end
        end
    
        def index_by_user
        user = User.find_by(username: params[:username])
    
        if user
            @tweets = user.tweets
            render 'tweets/index'
        end
        end
    
        private
    
        def tweet_params
            params.require(:tweet).permit(:message, :image)
        end
    end
end