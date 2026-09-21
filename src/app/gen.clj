(ns app.gen
    (:require
      [app.data :refer [problems]]
      [hiccup.core :as h]))

(def s (slurp "1.html"))

(defn- render-test [i test]
  [:code {:style "display: flex; flex-flow: wrap;"}
   [:span.unit-test test]
   [:span {:id (str "pass" i)
           :class "hidden"
           :style "color: green; align-self: center; width: 4.5em; margin-left: auto;"}
    "🟢 pass"]
   [:span {:id (str "fail" i)
           :class "hidden"
           :style "color: red; align-self: center; width: 5.5em; margin-left: auto;"}
    "🔴 uh-oh"]])

(defn- render [{:keys [title tests description difficulty]}]
  (->> tests
       (map-indexed render-test)
       h/html
       (format s title difficulty description)))

(doseq [problem problems]
  (spit (format "dist/%s.html" (:id problem))
        (render problem)))

(def page
  [:html
   [:head [:title "Hello from Babashka"]]
   [:body
    [:h1 "Native Hiccup Support"]
    [:p "This is rendered natively via Babashka!"]]])

(defn -main [& args]
  (println (str (h/html page))))
